import React,{Component} from 'react';
import {reduxForm} from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './surveyFormReview';

class SurveyNew extends Component {
    state = {
        showFormReview:false
    }
    RenderContent()
    {
        if(this.state.showFormReview)
        {
            return <SurveyFormReview onGoBack={() => this.setState({showFormReview: false}) }/>;
        }

        return <SurveyForm onSurveySubmit={() => this.setState({showFormReview : true})}/>;
    }
    render(){
        return(
            <div>
              {this.RenderContent()}
            </div>
        );
    }
}

export default reduxForm({
    form:'surveyForm'
})(SurveyNew);