import { PinoLogger } from 'nestjs-pino'
import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { Query, Count, Name } from '../commons/interfaces/commons.interface'
import { OrganizationsService } from './organizations.interface'

import { Organization } from './organization.entity'

@Controller()
export class OrganizationsController {
  constructor(@Inject('OrganizationsService') private readonly organizationsService: OrganizationsService, private readonly logger: PinoLogger) {
    logger.setContext(OrganizationsController.name)
  }

  @GrpcMethod('OrganizationsService', 'findAll')
  async findAll(data: Query): Promise<Organization[]> {
    this.logger.info('OrganizationsController#findAll.call', data)

    const result = await this.organizationsService.findAll({
      attributes: data.attributes || undefined,
      where: data.where ? JSON.parse(data.where) : undefined,
      order: data.order ? JSON.parse(data.order) : undefined,
      offset: data.offset ? data.offset : 0,
      limit: data.limit ? data.limit : 25
    })

    this.logger.info('OrganizationsController#findAll.result', result)

    return result
  }

  @GrpcMethod('OrganizationsService', 'findByName')
  async findByName(data: Name): Promise<Organization> {
    this.logger.info('OrganizationsController#findByName.call', data)

    const result = await this.organizationsService.findOne({
      where: { name: data.name }
    })

    this.logger.info('OrganizationsController#findByName.result', result)

    return result
  }

  @GrpcMethod('OrganizationsService', 'count')
  async count(data: Query): Promise<Count> {
    this.logger.info('OrganizationsController#count.call', data)

    const count = await this.organizationsService.count({
      where: data.where ? JSON.parse(data.where) : undefined
    })

    this.logger.info('OrganizationsController#count.result', count)

    return { count }
  }
}
