import { Heading } from 'evergreen-ui';
import React from 'react';

const SectionHeading = ({ children, ...props }) => {
  return (
    <Heading size={700} paddingBottom="1rem" {...props}>
      {children}
    </Heading>
  );
};

export default SectionHeading;
