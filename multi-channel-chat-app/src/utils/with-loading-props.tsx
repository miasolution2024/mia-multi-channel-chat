/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, createContext } from 'react';

// ----------------------------------------------------------------------

export function withLoadingProps(loader: any) {
  const LoadingPropsContext = createContext({});

  const useLoadingProps = () => useContext(LoadingPropsContext);

  const DynamicComponent = loader(useLoadingProps);

  const WithLoadingPropsComponent = (props: any) => (
    <LoadingPropsContext.Provider value={props}>
      <DynamicComponent {...props} />
    </LoadingPropsContext.Provider>
  );

  return WithLoadingPropsComponent;
}
