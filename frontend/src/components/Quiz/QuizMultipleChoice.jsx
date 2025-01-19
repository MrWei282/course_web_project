import React from 'react';

import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import config from 'config.json';

const QuizMultipleChoice = ({ question, editable, answers, setAnswers, errors }) => {
  return (
    <FormControl
      error={errors[question.question_id] !== ''}
      component="fieldset"
    >
      <FormGroup>
        {config.quizzes.mc_answers.map((answer, idx) =>
          <FormControlLabel key={idx} label={question[`choice_${answer}`]} control={
            <Checkbox disabled={editable} checked={answers[question.question_id] === answer} onChange={() => setAnswers({ ...answers, [question.question_id]: answer })} />
          }/>
        )}
      </FormGroup>
      <FormHelperText>{errors[question.question_id]}</FormHelperText>
    </FormControl>
  )
}

export default QuizMultipleChoice;
