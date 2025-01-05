import pika
import docker 
import json

def connectToRabbitMq():
  connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
  channel = connection.channel()
  channel.queue_declare(queue='codeQueue', durable=True)
  return connection, channel

def runPythonCodeInDocker(code): 
  client = docker.from_env()
  container = client.containers.run(
    "python:3.8",
    f"python -c \"{code}\"",
    detach=True,
    stdout=True,
    stderr=True
  )
  container.wait()
  output = container.logs().decode('utf-8')
  container.remove()
  return output

def runJavascriptCodeInDocker(code):
  client = docker.from_env()
  container = client.containers.run(
    "node:22-slim",
    f"node -e \"{code}\"",
    detach=True,
    stdout=True,
    stderr=True
  )
  container.wait()
  output = container.logs().decode('utf-8')
  container.remove()
  return output

def callback(ch, method, properties, body):
  data = json.loads(body)
  code = data.get("code")
  lang = data.get("language")
  user = data.get("userId")
  output = ""
  
  try: 
    if lang == "javascript":
      output = runJavascriptCodeInDocker(code)
    elif lang == "python":
      output = runPythonCodeInDocker(code)
      
    print(f"Code Output: {output}")
    
    result_queue = 'resultQueue'
    ch.queue_declare(queue=result_queue, durable=True)
    result_data = {
      'output': output,
      'user': user
    }
    
    ch.basic_publish(
      exchange='',
      routing_key=result_queue,
      body=json.dumps(result_data)
    )
  
  except Exception as e:
    print(f"Error running code: {e}")
  
  ch.basic_ack(delivery_tag = method.delivery_tag)
  
def startWorker(): 
  connection, channel = connectToRabbitMq()
  channel.basic_consume(queue='codeQueue', on_message_callback=callback)
  
  print('Waiting for messages. To exit press CTRL + C')
  channel.start_consuming()
  
if __name__=='__main__':
  startWorker()