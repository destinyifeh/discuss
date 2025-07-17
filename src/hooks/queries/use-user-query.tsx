import {useQuery, UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';

export const useUserQuery = (
  url: string,
  queryKey: string,
  options?: UseQueryOptions<AxiosResponse, Error>,
): UseQueryResult<AxiosResponse, Error> => {
  return useQuery<AxiosResponse, Error>({
    queryKey: [queryKey],
    //queryFn: () => a.fetchData(url),
    ...options,
    enabled: !!url,
  });
};
