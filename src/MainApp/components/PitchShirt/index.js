import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from 'react-bootstrap';

import Fixtures from '../PlayerFixtures';

import usePremierData from '../../usePremierData';

/**
 * Check players point from live data. !! Move this to usePremierData??
 * @param {Number} id Element Id 
 * @param {import('../../../PremierContext/premier').Live} live Live Data
 */
const checkPoints = (id, live) => {
  if (!live) return null;
  let player = live.elements.find(e => e.id === id);
  if (!player) return null;
  else if (player.explain.length && player.explain[0].stats) {
    return player.explain[0].stats.reduce((a, b) => {
      return a + b.points;
    }, 0);
  } else return null;
}

const useFetch = (player, func, initialValue) => {
  const [ p, setData ] = useState(initialValue);
  const [ loading, setLoading ] = useState(true);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch fixtures
      let fixtures = await func(player.id);
      setData(fixtures);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [player]);
  useEffect(() => {
    fetchData();
  }, [ fetchData ]);
  return { loading, p };
}

/**
 * 
 * @param {Object} props
 * @param {Object} props.data - Player Data Object
 * @param {import('../../../PremierContext/premier').Pick} props.data.info - Player Info
 * @param {import('../../../PremierContext/premier').Element} props.data.player - Player Data
 * @param {import('../../../PremierContext/premier').Live} props.live - Live Data of the gameweek
 * @param {Function} props.viewPlayer - Function to show playercard 
 */
export default function PitchShirt({ data, live, viewPlayer }) {
  const { getElementInfo, getTeamShirt } = usePremierData();

  const [ player, setPlayer ] = useState(data.player);
  const [ fixture,setFixture] = useState(null);
  const [ points, setPoints ] = useState(0);
  const [ shirt,  setShirt  ] = useState('');
  const { loading, p } = useFetch(data.player, getElementInfo, null);

  useEffect(() => {
    console.log(`[${player?player.web_name:0}] Using effect`);
    if (loading) console.log(`[${player?player.web_name:0}] Waiting fixtures...`);
    if (p) {
      console.log(`[${player?player.web_name:0}] OK!`);
      setShirt(getTeamShirt(player));
      setPoints(checkPoints(player.id, live));
      setFixture(p);
    } 
    // Clean up
    return () => {
      console.log(`[${player?player.web_name:0}] Clean-up!`);
      //setPlayer(null);
      setFixture(null);
      setPoints(null);
      setShirt(null);
    }
  }, [ player, live, p ]);

  if ( !player ) return null;

  return (
    <div className="pitch-unit">
      <div className="pitch-element">
        <div className="pitch-element-styled">
          <button className="pitch-shirt-button" onClick={() => viewPlayer(player)}>
            <picture>
            <source></source>
              <img 
                alt="shirt"
                className="pitch-shirt-image" 
                src={`${shirt}-66.png`} 
                srcSet={`${shirt}-66.png 66w, ${shirt}-110.png 110w, ${shirt}-220.png 220w`}
                sizes="(min-width: 1024px) 55px, (min-width: 610px) 44px, 33px"
              ></img>
            </picture>
            <div>
              <div className="element-player-name"><b>{player.web_name}</b> &#183; <Badge>{points}</Badge></div>
              <div className="element-player-value">
                <Fixtures data={fixture} context={null} amount={3} mini />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}