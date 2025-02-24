type Example = {
  input: string;
  output: string;
};

type QuestionProps = {
  title: string;
  statement: string;
  examples: Example[];
  constraints: string[];
  testCases: string;
};

const Question = ({
  title,
  statement,
  examples,
  constraints,
  testCases,
}: QuestionProps) => {
  return (
    <div >
      <h1>{title}</h1>
      <p>{statement}</p>
      <h2>Examples:</h2>
      <ul>
        {examples?.map((example, index) => (
          <li key={index}>
            <strong>Input:</strong> {typeof example.input === 'object' ? JSON.stringify(example.input) : example.input} <br />
            <strong>Output:</strong> {typeof example.output === 'object' ? JSON.stringify(example.output) : example.output}
          </li>
        ))}
      </ul>
      <h2>Constraints:</h2>
      <ul>
        {constraints?.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>
      <h2>Test Cases:</h2>
      <ul>
        {testCases}
      </ul>
    </div>
  );
};

export default Question;
