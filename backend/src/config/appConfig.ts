class AppConfig {
  public port = process.env.PORT || 9000;
  public rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  public dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/xjudge';

  private static instance: AppConfig;

  private constructor() {}

  public static getInstance () {
    if(!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }
}

export const appConfig = AppConfig.getInstance();