import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import formFields from './formFields';
import {withRouter} from 'react-router-dom';
import * as actions from '../../actions';

const SurveyFormReview = ({onGoBack, formValues, submitSurvey,history}) => {
    
    const reviewFields = _.map(formFields, ({name,label}) => {
        return(
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        );
    });
    return(
        <div>
        <h5>please confirm your entries</h5>
        {reviewFields}
        <button className="yellow darken-3 btn-flat white-text" onClick={onGoBack}>Back</button>
        <button className="green right btn-flat white-text" onClick={() => submitSurvey(formValues, history)}>Send Survey
            <i className="material-icons right">email</i>
        </button>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        formValues: state.form.surveyForm.values
    }
}
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));