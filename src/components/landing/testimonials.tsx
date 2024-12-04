import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content: "BudgetSmart has completely transformed how I manage both my personal and business finances. The insights are invaluable!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content: "The goal tracking feature helped me save for my dream house in record time. Highly recommended!",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Freelancer",
    content: "As someone with variable income, BudgetSmart's flexible budgeting tools are exactly what I needed.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-20 bg-secondary/50">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by thousands
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-background p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}