/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { Card, Flex, Text, Button, Box } from '@maistro/ui';
import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons';
import env from '@/env';
import { AuthContext } from '@maistro/auth';

// TODO: this declaration is not working atm
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const Payments = () => {
  const { priceId } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Stripe script dynamically
  useEffect(() => {
    setLoading(true);

    try {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/pricing-table.js';
      script.async = true;

      script.onload = () => {
        setLoading(false);
      };

      script.onerror = () => {
        setError('Failed to load Stripe. Please try again later.');
        setLoading(false);
      };

      document.body.appendChild(script);

      return () => {
        // Clean up script when component unmounts
        document.body.removeChild(script);
      };
    } catch (err) {
      console.error('Error loading Stripe script:', err);
      setError('An error occurred while loading the payment page.');
      setLoading(false);
    }
  }, []);

  return (
    <Box className="max-w-6xl mx-auto px-4">
      <Flex direction="column">
        {/* Display loading state */}
        {loading && (
          <Flex direction="column" align="center" justify="center" py="9">
            <ReloadIcon className="animate-spin" width={36} height={36} />
            <Text size="3" mt="4">
              Loading options...
            </Text>
          </Flex>
        )}

        {/* Display error if one occurred */}
        {error && (
          <Card>
            <Flex direction="column" align="center" gap="4" p="4">
              <Cross2Icon color="var(--red-9)" width={32} height={32} />
              <Text align="center" color="red" weight="bold">
                {error}
              </Text>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </Flex>
          </Card>
        )}

        <Box>
          {/* @ts-expect-error see TODO above */}
          <stripe-pricing-table
            pricing-table-id={priceId}
            publishable-key={env.payments.stripe.key}
            client-reference-id={user?.getId() || undefined}
            customer-email={user?.getEmail() || undefined}
          >
            {/* @ts-expect-error see TODO above */}
          </stripe-pricing-table>
        </Box>
      </Flex>
    </Box>
  );
};

export default Payments;
