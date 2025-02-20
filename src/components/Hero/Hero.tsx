import styles from './Hero.module.css';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Unlock Social Media Success
          </h1>
          <div className={styles.descriptionWrapper}>
            <p className={styles.description}>
              Соціальні медіа - це потужний інструмент для розвитку вашого бізнесу. Наша платформа допоможе вам досягти максимального успіху в соціальних мережах.
            </p>
            <button className={styles.button}>
              Спробувати
            </button>
          </div>
        </div>
        
        <div className={styles.imageWrapper}>
          <Image 
            src="/dashboard-preview.png"
            alt="Dashboard Preview"
            width={1100}
            height={795}
            className={styles.image}
            loading="eager"
            quality={100}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero; 