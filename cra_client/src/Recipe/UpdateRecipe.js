import { Button, Pane, TextInputField, toaster } from 'evergreen-ui';
import { navigate } from '@reach/router';
import React from 'react';

import { getAuthToken } from '../utils/authentication';
import SectionHeading from '../components/SectionHeading';

class UpdateRecipe extends React.Component {
  state = {
    loading: true,
    recipe: {
      name: '',
      sourceUrl: '',
    },
  };

  componentDidMount() {
    const { id } = this.props;

    fetch(`/api/recipes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.status !== 200) {
          throw json;
        }
        console.log(json);
        const { name, sourceUrl } = json.data.attributes;
        this.setState({ loading: false, recipe: { name, sourceUrl } });
      })
      .catch(err => {
        console.log(err);
        if (err.status === 404) {
          navigate('/');
        }
      });
  }

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

    fetch(`/api/recipes/${this.props.id}`, {
      method: 'PUT',
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
        toaster.success('Recipe updated!');
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
          <SectionHeading>Update recipe</SectionHeading>
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
            Update
          </Button>
        </Pane>
      </form>
    );
  }
}

export default UpdateRecipe;
