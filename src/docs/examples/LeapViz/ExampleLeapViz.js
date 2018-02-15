import React from 'react';
import LeapViz from 'react-leap-three/LeapViz';
import LeapProvider from 'react-leap-three/LeapProvider';

export default function ExampleLeapViz(){
  return (
    <LeapProvider >
      <LeapViz width={100} height={100} />
    </LeapProvider>
  )
}