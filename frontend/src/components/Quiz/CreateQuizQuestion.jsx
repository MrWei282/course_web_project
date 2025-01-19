import React from 'react';

import { Box, Checkbox, TextField, Typography } from '@mui/material';
import config from 'config.json';

const CreateQuizQuestion = ({ question, setQuestion, questionNumber }) => {
  return (
    (question.type === 'Multiple Choice' &&
      <Box sx={{ alignSelf: 'flex-start' }}>
        <Typography sx={{ mb: question.error.answer === '' ? 2 : 0 }}>Please enter answers and select one correct answer.</Typography>
        <Typography color='error'>{question.error.answer}</Typography>

        {config.quizzes.mc_answers.map((answer, idx) =>
          <Box key={idx} sx={{ mt: 1 }}>
            <Checkbox checked={question.correct === answer} aria-label={`Answer ${answer}`} onChange={() => setQuestion(questionNumber, 'correct', answer)} />
            <TextField
              onChange={(e) => setQuestion(questionNumber, 'answers', { ...question.answers, [answer]: e.target.value })}
              size='small' label={`Answer ${answer}`}
              error={question.error.answers[answer] !== ''}
              helperText={question.error.answers[answer]}
            />
          </Box>
        )}
      </Box>
    ) || (question.type === 'Short Answer' &&
      <Box>
        <TextField
          label="Marks"
          size="small"
          onChange={e => setQuestion(questionNumber, 'marks', e.target.value)}
          error={question.error.marks !== ''}
          helperText={question.error.marks}
        />
        <Typography>Question will be manually marked by teacher.</Typography>
     </Box>
    )
  );
}

export default CreateQuizQuestion;
