import { Body, Controller, Post } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanDto } from './dto/plan.dto';

@Controller('execute')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  async execute(@Body() plan: PlanDto) {
    return this.planService.execute(plan.actions);
  }
}
