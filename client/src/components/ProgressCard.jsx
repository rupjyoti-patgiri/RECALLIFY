import React from 'react';

export default function ProgressCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // 'coral' | 'sage' | 'lavender' | 'crimson' | 'default'
  trend
}) {
  const variantStyles = {
    default: {
      bg: 'bg-white',
      iconBg: 'bg-cream-100 text-charcoal-700 border-cream-200',
      valueColor: 'text-charcoal-800'
    },
    coral: {
      bg: 'bg-white',
      iconBg: 'bg-coral-50 text-coral-600 border-coral-100',
      valueColor: 'text-coral-600'
    },
    sage: {
      bg: 'bg-white',
      iconBg: 'bg-sage-50 text-sage-600 border-sage-100',
      valueColor: 'text-sage-700'
    },
    lavender: {
      bg: 'bg-white',
      iconBg: 'bg-lavender-50 text-lavender-600 border-lavender-100',
      valueColor: 'text-lavender-600'
    },
    crimson: {
      bg: 'bg-white',
      iconBg: 'bg-crimson-50 text-crimson-600 border-crimson-100',
      valueColor: 'text-crimson-600'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`p-6 rounded-3xl border border-cream-300 shadow-soft transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-0.5 ${style.bg}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl border ${style.iconBg} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight ${style.valueColor}`}>
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-charcoal-500">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-charcoal-500 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
