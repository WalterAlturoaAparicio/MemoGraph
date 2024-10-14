import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from './database.module' 
import { ConfigModule } from '@nestjs/config'
import { DataSource } from 'typeorm'

describe('DatabaseModule', () => {
  let module: TestingModule
  let dataSource: DataSource

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              DB_HOST: 'localhost',
              DB_PORT: 3306,
              DB_USER: 'test',
              DB_PASSWORD: 'test',
              DB_NAME: 'test_db',
            }),
          ],
        }),
        DatabaseModule,
      ],
    }).compile()

    dataSource = module.get<DataSource>(DataSource)
    if (!dataSource.isInitialized) {
      await dataSource.initialize() // Inicializa la conexión solo una vez
    }
  })

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy()
    }
  })

  it('should be defined', () => {
    expect(dataSource).toBeDefined()
  })

  it('should import ConfigService', () => {
    const options = dataSource.options

    // Verifica si el tipo de base de datos es MySQL
    if ('host' in options) {
      expect(options.host).toBe('localhost')
      expect(options.port).toBe(3306)
    } else if ('database' in options) {
      // Si es SQLite o cualquier otra base de datos que no tenga 'host'
      expect(options.database).toBe('test_db') // Cambia según tu configuración
    }
  })
})
