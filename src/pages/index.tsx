import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = ({ pageParam = 6 || null }): any =>
    api.get('api/images', {
      params: {
        after: pageParam
      }
    }).then(response => response.data);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    fetchImages,
    {
      getNextPageParam: (lastPage, pages) => lastPage.after,
    }
  );

  const formattedData = useMemo(() => {
    const fdata = data?.pages.map(item => item.data);

    return fdata?.flat();
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box display="flex" flexDirection="column" maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage &&
          <Button alignSelf='center' style={{ margin: '20px 0px' }} disabled={!hasNextPage} onClick={() => fetchNextPage()}>
            {isFetchingNextPage
              ? 'Carregando...'
              : 'Carregar mais'}
          </Button>}

      </Box>
    </>
  );
}
