import { useMemo } from 'react';
import { useAsyncError, useRouteError } from 'react-router'

function ErrorPage() {
  const routerError = useRouteError() as Error | undefined
  const loaderError = useAsyncError() as Error | undefined
  
  const error = useMemo(() => {
    return routerError || loaderError
  }, [loaderError, routerError])
  
  return (
    <div className="wrapper">
      <div className="container">
        <h2 className="text-danger m-0">Sorry, an unexpected fatal error has occurred, give this information to the
          developer</h2>
        
        {error && (
          <>
            <h3 className="text-danger mt-3 mb-2">{error.message}</h3>
            <h3 className="text-danger m-0">{error.stack}</h3>
          </>
        )}
      </div>
    </div>
  )
}

export default ErrorPage