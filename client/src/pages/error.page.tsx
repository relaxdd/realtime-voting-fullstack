import { useMemo } from 'react';
import { useAsyncError, useRouteError } from 'react-router';

function ErrorPage() {
  const routerError = useRouteError() as Error | undefined;
  const loaderError = useAsyncError() as Error | undefined;
  
  const error = useMemo(() => {
    return routerError || loaderError;
  }, [loaderError, routerError]);
  
  return (
    <div className="container">
      <h1 className="my-4 leading-[1.2]">
        Sorry, an unexpected fatal error has occurred. <br />
        Give this information to the developer
      </h1>
      
      {error && (
        <>
          <h2 className="text-red-500 mb-7 text-[20px]">{error.message}</h2>
          
          <pre className="py-7 px-8 bg-accent w-[100%] rounded-[0.25rem]">{error.stack}</pre>
        </>
      )}
    </div>
  );
}

export default ErrorPage;