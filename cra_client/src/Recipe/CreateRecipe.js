import { Button, Pane, TextInputField, toaster } from 'evergreen-ui';
import { navigate } from '@reach/router';
import React from 'react';

import { getAuthToken } from '../utils/authentication';
import SectionHeading from '../components/SectionHeading';

class CreateRecipe extends React.Component {
  state = {
    recipe: {
      name: '',
      sourceUrl: '',
    },
  };

  handleRecipeNameChange = e => {
    this.setState({ recipe: { ...this.state.recipe, name: e.target.value } });
  };

  handleRecipeSourceUrlChange = e => {
    this.setState({
      recipe: { ...this.state.recipe, sourceUrl: e.target.value },
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
      body: JSON.stringify({
        recipe: {
          name: this.state.recipe.name,
          ['source_url']: this.state.recipe.sourceUrl,
        },
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
        toaster.success('Created a new recipe!');
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Pane display="flex" flexDirection="column" width="280px">
          <SectionHeading>Create a new recipe</SectionHeading>
          <TextInputField
            label="Name"
            type="text"
            name="name"
            onChange={this.handleRecipeNameChange}
            value={this.state.recipe.name}
          />
          <TextInputField
            label="Source"
            type="text"
            name="sourceUrl"
            onChange={this.handleRecipeSourceUrlChange}
            value={this.state.recipe.sourceUrl}
          />
          <Button intent="default" type="submit" justifyContent="center">
            Save
          </Button>
        </Pane>
      </form>
    );
  }
}

export default CreateRecipe;
