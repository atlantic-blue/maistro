import React from 'react';
import { Box } from '@maistro/ui';

interface MapProps {
  zoom?: string;
  address: {
    firstLine: string;
    city: string;
    postcode: string;
    country: string;
  };
}

const GoogleMap: React.FC<MapProps> = (props) => {
  const zoom = props.zoom || '12';

  const url = new URL('https://maps.google.com/maps');
  url.searchParams.append('hl', 'en');
  url.searchParams.append(
    'q',
    `${props.address.firstLine}, ${props.address.city}, ${props.address.postcode}, ${props.address.country}`
  );
  url.searchParams.append('z', zoom);
  url.searchParams.append('t', '');
  url.searchParams.append('ie', 'UTF8');
  url.searchParams.append('iwloc', 'B');
  url.searchParams.append('output', 'embed');

  return (
    <Box>
      <iframe title="Google maps" width="100%" height="400" src={url.toString()}></iframe>
    </Box>
  );
};

export default GoogleMap;
