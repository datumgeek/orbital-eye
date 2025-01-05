import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';

interface ProjectInfoProps {
  title: string;
  description: string;
  links: { label: string; url: string }[];
}

export const ProjectInfo: React.FC = () => {
  const title = 'Orbital Eye - Project Info';
  const description = 'A playground of satellite visualizations';
  const links = [
    {
      label: 'Orbital Eye on GitHub',
      url: 'https://github.com/datumgeek/orbital-eye',
    },
    {
      label: 'Orbital Eye Playground Documentation',
      url: 'https://github.com/datumgeek/orbital-eye/blob/main/libs/orbital-eye/e02-visualize/README.md',
    },
    {
      label: 'Comcast Porrtal Open Source Project',
      url: 'https://github.com/comcast/porrtal',
    },
  ];

  return (
    <Box padding={2} maxWidth={800}>
      {/* Header Section */}
      <Box textAlign="center" marginBottom={4}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {/* Cards for Links */}
      {links.map((link, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{link.label}</Typography>
          </CardContent>
          <CardActions>
            <Button
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              color="primary"
            >
              Visit Link
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default ProjectInfo;
