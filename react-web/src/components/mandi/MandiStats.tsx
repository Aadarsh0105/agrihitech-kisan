import {
  Landmark,
  Building2,
  Wheat,
  IndianRupee,
} from "lucide-react";

interface Props {
  total: number;
}

export default function MandiStats({
  total,
}: Props) {

  const stats = [
    {
      title: "Records",
      value: total.toLocaleString("en-IN"),
      icon: Wheat,
    },
    {
      title: "Markets",
      value: "7000+",
      icon: Building2,
    },
    {
      title: "States",
      value: "36",
      icon: Landmark,
    },
    {
      title: "Price Unit",
      value: "₹ / Quintal",
      icon: IndianRupee,
    },
  ];

  return (
    <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >

            <div className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-green-100
            ">

              <Icon
                size={28}
                className="text-green-600"
              />

            </div>

            <p className="mt-6 text-sm text-gray-500">

              {item.title}

            </p>

            <h2 className="mt-2 text-3xl font-black text-gray-900">

              {item.value}

            </h2>

          </div>

        );

      })}

    </section>
  );
}