import { useNavigate } from '@tanstack/react-router';
import GradientButton from './GradientButton';

export default function HeroSection() {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate({ to: '/dashboard' });
  };

  return (
    <section className="bg-white py-20 dark:bg-background md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-brand-navy md:text-5xl lg:text-6xl">
            practice MHT-CET with real exam level mock tests
          </h1>
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Free practice tests designed by COEPians
          </p>
          <GradientButton size="lg" onClick={handleStartTest}>
            Start Free Test
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
