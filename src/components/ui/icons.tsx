import * as React from 'react';

export function AsteroidIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M13.5 11a3 3 0 1 0 -3 -3a3 3 0 0 0 3 3z"></path>
      <path d="M5 19l3 -2l2 2l3 -2l2 2l3 -2"></path>
      <path d="M4 4l7 3l2.5 5"></path>
      <path d="M20 7l-7 3l-2.5 5"></path>
    </svg>
  );
}

export function ToothIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-12"></path>
      <path d="M9 6a3 3 0 0 1 6 0"></path>
      <path d="M6 10a4 4 0 0 0 12 0"></path>
      <path d="M6 14a4 4 0 0 1 12 0"></path>
      <path d="M6 18a2 2 0 0 1 12 0"></path>
    </svg>
  );
}
