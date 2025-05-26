/* eslint-disable */
import { useParams, useNavigate } from 'react-router';
import { Box, Heading, Text, Card, Flex, Button, Grid, Link } from '@radix-ui/themes';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { contenidoConPoder, courses } from '../data/initialCourse';
import { useEffect, useRef } from 'react';
import useLocalProgress from '@/Components/Course/useLocalProgress';

const ModuleLayout = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // In a real app, fetch the course and find the lesson
  const course = courseId ? courses[courseId] : courses[''];
  const moduleIndex = course.modules.findIndex((module) => module.id === moduleId);
  const module = course.modules[moduleIndex];

  if (!module) {
    navigate(`/courses/${courseId}`);
    return null;
  }

  const findAdjacentModules = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (moduleIndex > 0) {
        return course.modules[moduleIndex - 1];
      }
    } else {
      if (moduleIndex < course.modules.length - 1) {
        return course.modules[moduleIndex + 1];
      }
    }

    return null;
  };

  const prevModule = findAdjacentModules('prev');
  const nextModule = findAdjacentModules('next');

  const { getModuleProgress, setModuleCompleted, setModulePosition } = useLocalProgress(
    course.id,
    course.modules.length
  );

  const moduleProgress = getModuleProgress(module.id);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (moduleProgress.lastPosition > 0) {
      video.currentTime = moduleProgress.lastPosition;
    }

    const interval = setInterval(() => {
      if (video.paused) return;
      setModulePosition(module.id, video.currentTime);
    }, 1000 * 10);

    const handleVideoEnd = () => {
      setModuleCompleted(module.id);
      navigateToNextModule();
    };

    const handleVideoStart = () => {
      if (!video.paused) return;
      // Check if video is buffered enough to start
      const isBuffered = () => {
        for (let i = 0; i < video.buffered.length; i++) {
          if (
            video.buffered.start(i) <= video.currentTime &&
            video.buffered.end(i) - video.currentTime > 3
          ) {
            return true;
          }
        }
        return false;
      };

      if (isBuffered()) {
        // Attempt to autoplay
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Autoplay succeeded
              console.log('Autoplay started successfully');
            })
            .catch((error) => {
              // Autoplay was prevented
              console.log('Autoplay failed, likely due to browser policy', error);
              // Optionally fallback to muted autoplay or show a play button
              // video.muted = true;
              // video.play(); // Optional muted fallback
            })
            .finally(() => {});
        }
      }
    };

    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('canplaythrough', handleVideoStart);
    return () => {
      clearInterval(interval);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('canplaythrough', handleVideoStart);
    };
  });

  const navigateToPrevModule = () => {
    if (!prevModule) {
      return;
    }
    navigate(`/courses/${courseId}/${prevModule.id}`);
  };

  const navigateToNextModule = () => {
    if (!nextModule) {
      return;
    }
    navigate(`/courses/${courseId}/${nextModule.id}`);
  };

  const onCompleteModule = () => {
    setModuleCompleted(module.id);
    navigateToNextModule();
  };

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Button onClick={() => navigate(`/courses/${courseId}`)} variant="soft" color="gray">
          <ArrowLeftIcon /> Back to Course
        </Button>

        <Flex gap="2">
          <Button onClick={navigateToPrevModule} variant="soft" disabled={!prevModule}>
            <ArrowLeftIcon /> Previous
          </Button>

          <Button onClick={navigateToNextModule} variant="soft" disabled={!nextModule}>
            Next <ArrowRightIcon />
          </Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '1', md: '3fr 1fr' }} gap="4">
        <Box>
          <Heading size="5" mb="2" align="center">
            {module.title}
          </Heading>
          <Flex align="center" gap="2" mb="4" direction="column">
            <Text size="2" color="gray">
              Duration: {module.duration}
            </Text>
            {moduleProgress.completed && (
              <Flex align="center" gap="1">
                <CheckCircledIcon color="var(--green-9)" />
                <Text size="2" color="green">
                  Completed
                </Text>
              </Flex>
            )}
          </Flex>

          <Card size="2" mb="4">
            <Box
              style={{
                backgroundColor: 'black',
                borderRadius: 'var(--radius-2)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9', // Enforces same ratio
                  backgroundColor: '#000', // Prevents white flash while loading
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <video
                  key={module.id}
                  ref={videoRef}
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Ensures the poster covers the whole area
                    display: 'block',
                  }}
                  poster={module.thumbnail}
                  preload="auto"
                >
                  <source src={module.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </Box>
          </Card>

          <Card size="2">
            <Box p="4">
              <Heading size="3" mb="2">
                Descripcion
              </Heading>
              <Text as="p">{module.description}</Text>

              <Flex gap="3" direction="column" align="center">
                {module.links &&
                  module.links.map((link) => {
                    return (
                      <Link href={link.href} target="_blank">
                        {link.title}
                      </Link>
                    );
                  })}
              </Flex>

              <Flex justify="end" mt="4">
                {!moduleProgress.completed ? (
                  <Button onClick={onCompleteModule} color="indigo">
                    Completar Modulo
                  </Button>
                ) : nextModule ? (
                  <Button onClick={navigateToNextModule} color="indigo">
                    Ir al siguiente modulo
                  </Button>
                ) : (
                  <Button onClick={() => navigate(`/courses/${courseId}`)} color="indigo">
                    Volver al curso
                  </Button>
                )}
              </Flex>
            </Box>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default ModuleLayout;
