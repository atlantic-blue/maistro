/* eslint-disable */
import { useParams } from 'react-router';
import { Box, Heading, Text, Flex, Card } from '@maistro/ui';
import { featuredCourse } from '../data/initialCourse';
import { useEffect, useRef } from 'react';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  // In a real implementation, you would fetch the course by ID
  // For now, we'll just use our single course
  const course = featuredCourse;

  useEffect(() => {
    // You could track video progress here in the future
    return () => {
      // Clean up if needed
    };
  }, [courseId]);

  return (
    <Box p="4">
      <Heading size="6" mb="4">
        {course.title}
      </Heading>

      <Card size="2" mb="4">
        <Box
          style={{
            backgroundColor: 'black',
            borderRadius: 'var(--radius-2)',
            overflow: 'hidden',
          }}
        >
          <video
            ref={videoRef}
            controls
            width="100%"
            height="auto"
            style={{ display: 'block' }}
            poster={course.thumbnail}
          >
            <source src={course.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Card>

      <Flex gap="4" direction="column">
        <Box style={{ flex: '3' }}>
          <Card size="2">
            <Box p="4">
              <Heading size="3" mb="2">
                About This Course
              </Heading>
              <Text as="p" size="2">
                {course.description}
              </Text>

              <Heading size="2" mt="4" mb="2">
                What You'll Learn
              </Heading>
              <Box className="flex flex-col">
                <Text size="2">Introduction to the platform</Text>
                <Text size="2">How to navigate courses</Text>
                <Text size="2">Tips for effective learning</Text>
              </Box>
            </Box>
          </Card>
        </Box>

        <Box style={{ flex: '1' }}>
          <Card size="2">
            <Box p="4">
              <Heading size="2" mb="2">
                Course Details
              </Heading>
              <Flex direction="column" gap="2">
                <Text size="2">
                  <strong>Instructor:</strong> {course.instructor}
                </Text>
                <Text size="2">
                  <strong>Duration:</strong> {course.duration}
                </Text>
                <Text size="2">
                  <strong>Access:</strong> Free
                </Text>
              </Flex>
            </Box>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
};

export default CoursePlayer;
