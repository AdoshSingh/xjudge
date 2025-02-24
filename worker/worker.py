import pika
import docker 
import json
import os

def connectToRabbitMq():
  connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
  channel = connection.channel()
  channel.queue_declare(queue='codeQueue', durable=True)
  return connection, channel

def runPythonCodeInDocker(code, testcases):
  host_testcases_file_path = os.path.abspath('testcases.txt')
  container_testcases_file_path = '/app/testcases.txt'
  
  with open(host_testcases_file_path, 'w') as file:
    file.write(testcases)
    
  host_code_file_path = os.path.abspath('main.py')
  container_code_file_path = '/app/main.py'
  
  with open(host_code_file_path, 'w') as file:
    file.write(code)
  
  client = docker.from_env()
  container = client.containers.run(
    "python:3.8",
    f"python {container_code_file_path}",
    volumes={
      host_code_file_path: {
        'bind': container_code_file_path,
        'mode': 'ro'
      },
      host_testcases_file_path: {
        'bind': container_testcases_file_path,
        'mode': 'ro'
      }
    },
    working_dir='/app',
    detach=True,
    stdout=True,
    stderr=True
  )
  container.wait()
  output = container.logs().decode('utf-8')
  container.remove()
  return output

def runJavascriptCodeInDocker(code, testcases):
  host_testcases_file_path = os.path.abspath('testcases.txt')
  container_testcases_file_path = '/app/testcases.txt'
  
  with open(host_testcases_file_path, 'w') as file:
    file.write(testcases)
    
  host_code_file_path = os.path.abspath('index.js')
  container_code_file_path = '/app/index.js'
  
  with open(host_code_file_path, 'w') as file:
    file.write(code)
    
  client = docker.from_env()
  container = client.containers.run(
    "node:22-slim",
    f"node {container_code_file_path}",
    volumes={
      host_code_file_path: {
        'bind': container_code_file_path,
        'mode': 'ro'
      },
      host_testcases_file_path: {
        'bind': container_testcases_file_path,
        'mode': 'ro'
      }
    },
    working_dir='/app',
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
  testcases = data.get("testcases")
  output = ""
  
  print(f"Received code: {code}")
  
  try: 
    if lang == "javascript":
      output = runJavascriptCodeInDocker(code, testcases)
    elif lang == "python":
      output = runPythonCodeInDocker(code, testcases)
      
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