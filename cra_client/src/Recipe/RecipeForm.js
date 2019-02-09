import { Button, Pane, TextInputField } from 'evergreen-ui';
import React from 'react';

import SectionHeading from '../components/SectionHeading';

class RecipeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.initialRecipe.name,
      sourceUrl: props.initialRecipe.sourceUrl,
    };
  }

  handleRecipeNameChange = e => {
    this.setState({ name: e.target.value });
  };

  handleRecipeSourceUrlChange = e => {
    this.setState({
      sourceUrl: e.target.value,
    });
  };

  submitRecipe = e => {
    e.preventDefault();

    this.props.onSubmit({
      name: this.state.name,
      sourceUrl: this.state.sourceUrl,
    });
  };

  render() {
    return (
      <form onSubmit={this.submitRecipe}>
        <Pane display="flex" flexDirection="column" width="280px">
          <SectionHeading>
            {this.props.sectionHeading}
          </SectionHeading>
          <TextInputField
            label="Name"
            type="text"
            name="name"
            onChange={this.handleRecipeNameChange}
            value={this.state.name}
          />
          <TextInputField
            label="Source"
            type="text"
            name="sourceUrl"
            onChange={this.handleRecipeSourceUrlChange}
            value={this.state.sourceUrl}
          />
          <Button intent="default" type="submit" justifyContent="center">
            {this.props.buttonText}
          </Button>
        </Pane>
      </form>
    );
  }
}

export default RecipeForm;
