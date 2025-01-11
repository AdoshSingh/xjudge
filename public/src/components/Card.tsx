type CardProps = {
  title: string;
};

const Card = ({
  title,
}: CardProps) => {
  return (
    <div className=" border p-4 w-32 rounded-md">
      <h1>{title}</h1>
    </div>
  );
};

export default Card;
