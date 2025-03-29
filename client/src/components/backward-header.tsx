import { LucideArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const BackwardHeader = ({ title }: { title: string | undefined }) => {
  return (
    <div className="flex items-center my-0 gap-x-4 mb-7">
      <Link to="/"><LucideArrowLeft /></Link>
      <h1 className="m-0! leading-[1.2]">{title}</h1>
    </div>
  );
};

export default BackwardHeader;