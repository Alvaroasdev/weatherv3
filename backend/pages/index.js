import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>WeatherInfo API - Backend</title>
        <meta name="description" content="API backend para WeatherInfo - Servicio de clima en tiempo real" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">WeatherInfo API</h1>
          <p className="text-gray-600">Backend funcionando correctamente</p>
        </div>
      </div>
    </>
  );
}
