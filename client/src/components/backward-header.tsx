import { zod } from '@/index.ts';
import { AppLinks } from '@/shared/defines.ts';
import useValidateZodProps from '@/shared/hooks/useValidateZodProps.ts';
import { LucideArrowLeft } from 'lucide-react';
import { FC } from 'react';
import { Link } from 'react-router';

const propsSchema = zod.object({
  title: zod.string().optional(),
});

type Props = zod.infer<typeof propsSchema>

const BackwardHeader: FC<Props> = (props) => {
  const { title } = useValidateZodProps(props, propsSchema);
  
  return (
    <div className="flex items-center my-0 gap-x-4 mb-7">
      <Link to={AppLinks.root} aria-label="Назад к списку">
        <LucideArrowLeft />
      </Link>
      
      <h1 className="m-0! leading-[1.2]">{title}</h1>
    </div>
  );
};

export default BackwardHeader;