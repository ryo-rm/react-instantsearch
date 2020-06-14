import { isEqual } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import qs from 'qs';
import algoliasearch from 'algoliasearch/lite';
import { findResultsState } from 'react-instantsearch-dom/server';
import { Head, App } from '../components';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const updateAfter = 700;

const createURL = state => `?${qs.stringify(state)}`;

const pathToSearchState = path =>
  path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

const searchStateToURL = searchState =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';

const DEFAULT_PROPS = {
  searchClient,
  indexName: 'instant_search',
};

const Page = ({ searchState: initialSearchState, resultsState }) => {
  const [searchState, setSearchState] = React.useState(initialSearchState);
  const { push } = useRouter();
  const timeoutId = React.useRef();
  const prevState = React.useRef();

  const onSearchStateChange = React.useCallback(state => {
    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      if (isEqual(state, prevState.current)) return;
      prevState.current = state;
      const href = searchStateToURL(state);
      push(href, href, {
        shallow: true,
      });
    }, updateAfter);

    setSearchState(state);
  }, []);

  return (
    <div>
      <Head title="Home" />
      <App
        {...DEFAULT_PROPS}
        searchState={searchState}
        resultsState={resultsState}
        onSearchStateChange={onSearchStateChange}
        createURL={createURL}
      />
    </div>
  );
};

Page.getInitialProps = async ({ asPath }) => {
  const searchState = pathToSearchState(asPath);
  const resultsState = await findResultsState(App, {
    ...DEFAULT_PROPS,
    searchState,
  });

  return {
    resultsState,
    searchState,
  };
};

Page.propTypes = {
  searchState: PropTypes.object,
  resultsState: PropTypes.object,
};

export default Page;
