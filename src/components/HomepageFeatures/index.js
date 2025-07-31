import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const list = [
  {
    title: 'Простая установка',
    description: (
      <>
        NurOS легко устанавливается и настраивается. Следуйте нашим пошаговым
        инструкциям для быстрого старта.
      </>
    ),
  },
  {
    title: 'Полная документация',
    description: (
      <>
        Вся документация по системе управления пакетами, серверу Tulpar
        и утилитам в одном месте.
      </>
    ),
  },
  {
    title: 'Открытый исходный код',
    description: (
      <>
        NurOS - открытая операционная система. Изучайте код,
        вносите вклад и создавайте собственные решения.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {list.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
