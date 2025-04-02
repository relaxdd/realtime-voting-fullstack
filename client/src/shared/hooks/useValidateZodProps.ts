import { useMemo } from 'react';
import { z, ZodObject, ZodRawShape } from 'zod';
import { fromError } from 'zod-validation-error';

function useValidateZodProps<Schema extends ZodRawShape>(
  props: unknown,
  schema: ZodObject<Schema>,
): z.infer<ZodObject<Schema>> {
  return useMemo(() => {
    try {
      return schema.parse(props);
    } catch (err) {
      const validationError = fromError(err);
      console.warn(validationError.toString());
      
      throw validationError;
    }
  }, [props, schema]);
}

export default useValidateZodProps;