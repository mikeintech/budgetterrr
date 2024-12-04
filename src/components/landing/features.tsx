import { Wallet, PieChart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Wallet className="h-12 w-12 text-primary" />,
    title: "Smart Budgeting",
    description: "Automatically track expenses and create flexible budgets that adapt to your lifestyle."
  },
  {
    icon: <PieChart className="h-12 w-12 text-primary" />,
    title: "Goal Tracking",
    description: "Set and track multiple financial goals with intelligent progress monitoring and alerts."
  },
  {
    icon: <TrendingUp className="h-12 w-12 text-primary" />,
    title: "Financial Insights",
    description: "Get personalized recommendations and visualize your financial future with our simulation tools."
  }
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to succeed
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-lg bg-card border hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}