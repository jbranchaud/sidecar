import { Icon, Pane, Text } from 'evergreen-ui';
import React from 'react';

import SectionHeading from '../components/SectionHeading';

const RecipeListing = ({ recipes }) => {
  return (
    <Pane marginTop="2rem">
      <SectionHeading>Recipes</SectionHeading>
      <ul>
        {recipes.map((recipe, i) => {
          const isOdd = i % 2 !== 0;

          return (
            <li key={recipe.id}>
              <Pane
                display="flex"
                justifyContent="space-between"
                background={(isOdd && 'tint2') || ''}
              >
                <Text>
                  {recipe.attributes.name}
                </Text>
                <Pane display="flex">
                  <Pane borderRadius="3px" padding="2px" marginLeft="2px">
                    <a href={`/recipe/${recipe.id}/edit`}>
                      <Icon icon="edit" />
                    </a>
                  </Pane>
                  <Pane borderRadius="3px" padding="2px" marginLeft="2px">
                    <a href={recipe.attributes.sourceUrl} target="_blank">
                      <Icon icon="link" />
                    </a>
                  </Pane>
                </Pane>
              </Pane>
            </li>
          );
        })}
      </ul>
    </Pane>
  );
};

export default RecipeListing;
