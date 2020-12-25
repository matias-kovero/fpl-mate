import React, { useEffect, useState, useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import Fixtures from '../Fixtures';

/**
 * Render player shirt and information on the pitch.
 * @param {Object} props 
 * @param {Object} props.data - Player data object
 * @param {import('../../../../PremierContext/premier').Pick} props.data.info - Player Info
 * @param {import('../../../../PremierContext/premier').Element} props.data.player - Player Data
 * @param {import('../../../../PremierContext/premier').Live} props.live - Live Data
 */
export default function PlayerShirt({ data, live, context, onCheck }) {
  const [ player, setPlayer ] = useState();
  const [ fixtures, setFixtures] = useState();
  const points = useMemo(() => checkPoints(data.player.id, live), [ data.player, live ]);
  const shirt = useMemo(() => checkShirt(player), [ player ]);
  
  useEffect(() => {
    if (data.player && data.player.id) {
      setPlayer(data.player);
      const fetchData = async (id) => {
        // Get players fixture
        let fixture_res = await context.GetElementInfo(id);
        setFixtures(fixture_res);
      }
      fetchData(data.player.id);
    }
  }, [ data.player ]);

  return (
    <div className="pitch-unit">
      { player ? 
      <div className="pitch-element">
        <div className="pitch-element-styled">
          <button className="pitch-shirt-button" onClick={() => onCheck(player)}>
            <picture>
            <source></source>
              <img 
                className="pitch-shirt-image" 
                src={`${shirt}-66.png`} 
                srcSet={`${shirt}-66.png 66w, ${shirt}-110.png 110w, ${shirt}-220.png 220w`}
                sizes="(min-width: 1024px) 55px, (min-width: 610px) 44px, 33px"
              ></img>
            </picture>
            <div>
              <div className="element-player-name"><b>{player.web_name}</b> &#183; <Badge>{points}</Badge></div>
              <div className="element-player-value">
                <Fixtures data={fixtures} context={context} amount={3} mini />
              </div>
            </div>
          </button>
        </div>
      </div> : null }
    </div>
  )
}
// &#183;

/**
 * 
 * @param {import('../../../../PremierContext/premier').LiveElement} player 
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

const checkShirt = (player) => {
  if (!player || !player.team_code) return '';
  return `https://fpl-server.vercel.app/dist/img/shirts/standard/shirt_${player.team_code}${player.element_type === 1 ? '_1': ''}`;
}