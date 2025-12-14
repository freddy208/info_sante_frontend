interface TrustFeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export function TrustFeature({ icon: Icon, title, description }: TrustFeatureProps) {
  return (
    <div className="text-center">
      <div className="inline-flex p-3 bg-teal-100 rounded-full text-teal-600 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}