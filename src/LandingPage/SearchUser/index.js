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
    // Trigger animation...
    let bg = document.getElementById('emoji-bg');
    let logo = document.getElementById('page-logo');
    bg.classList.add('animate-bg');
    logo.classList.add('animate-logo');
    // After 1s fetch user information
    setTimeout(() => {
      searchProfile(id);
      bg.classList.remove('animate-bg');
      logo.classList.remove('animate-logo');
    }, 900);
  }

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <InputGroup className="" size="md">
      <AsyncTypeahead
        filterBy={filterBy}
        id="async-example"
        isLoading={isLoading}
        labelKey="label"
        minLength={3}
        onSearch={handleSearch}
        options={options}
        placeholder="Start by typing your Team, Manager or ID"
        renderMenuItemChildren={(option, props) => (
          <Fragment>
            <div className="user-search-option" onClick={() => {
              updateId(option.value);
              //selectUser(option.value);
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
      <InputGroup.Append className="landing-buttongroup">
        <Button variant="light" onClick={searchButtonClick}><span style={{lineHeight: '2rem', verticalAlign: 'bottom'}}>Go</span></Button>
      </InputGroup.Append>
    </InputGroup>
  );
};