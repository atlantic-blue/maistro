import React from 'react';
import { Button as MaistroButton } from '@maistro/ui';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">shadcn/ui Integration</h1>
        <div className="flex space-x-2">
          {/* <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button> */}
        </div>

        <div className="flex space-x-2">
          <MaistroButton>Default</MaistroButton>
          <MaistroButton variant="destructive">Destructive</MaistroButton>
          <MaistroButton variant="outline">Outline</MaistroButton>
          <MaistroButton variant="secondary">Secondary</MaistroButton>
          <MaistroButton variant="ghost">Ghost</MaistroButton>
          <MaistroButton variant="link">Link</MaistroButton>
        </div>
      </div>
    </div>
  );
};

export default App;
