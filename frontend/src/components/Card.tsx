import { Link } from "react-router-dom";

type CardProps = {
  title: string;
  id: string;
};

const Card = ({ title, id }: CardProps) => {
  return (
    <Link to={`/ques/${id}`}>
      <div className=" border p-4 w-32 rounded-md">
        <h1>{title}</h1>
      </div>
    </Link>
  );
};

export default Card;
