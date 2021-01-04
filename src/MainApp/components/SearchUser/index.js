import React, { Fragment, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { InputGroup, Button } from 'react-bootstrap';
import 'react-bootstrap-typeahead/css/Typeahead.css';


const SEARCH_URI = 'https://fpl-server.vercel.app/search';

export default function AsyncExample({ searchProfile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [id, setId] = useState('');

  const handleSearch = (query) => {
    setIsLoading(true);

    fetch(`${SEARCH_URI}/${query}`)
      .then((resp) => resp.json())
      .then((items) => {
        const options = items.map((i) => {
          let [owner, team] = i.label.split(',', 2);
          return ({
            value: i.value,
            id: i.value,
            label: i.label,
            owner,
            team
          })
        });

        setOptions(options);
        setIsLoading(false);
      })
      .catch((err) => {
        setOptions([{
          value: '',
          id: '',
          label: '',
          owner: '0 results',
          team: 'Please check your search'
        }])
        setIsLoading(false);
      });
  };

  const selectUser = (user) => {
    if (!user) return;
    searchProfile(user);
  }

  const updateId = (userId) => {
    setId(userId);
  }

  const searchButtonClick = () => {
    if (!id || id.length <= 0 || isNaN(id)) return null;
    searchProfile(id);
  }

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <InputGroup className="mt-3" size="sm">
      <AsyncTypeahead
        filterBy={filterBy}
        id="async-example"
        isLoading={isLoading}
        labelKey="label"
        minLength={3}
        size="sm"
        onSearch={handleSearch}
        options={options}
        placeholder="Team/Player Name or ID"
        renderMenuItemChildren={(option, props) => (
          <Fragment>
            <div className="user-search-option" onClick={() => {
              updateId(option.value);
              selectUser(option.value);
            }}>
              <div className="search-option-owner">
                <span>{option.owner}</span>
              </div>
              <div className="search-option-team">
                <span>{option.team}</span>
              </div>
            </div>
          </Fragment>
        )}
      />
      <InputGroup.Append>
        <Button variant="outline-success" onClick={searchButtonClick}>Search</Button>
      </InputGroup.Append>
    </InputGroup>
  );
};