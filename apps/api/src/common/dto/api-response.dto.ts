import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    example: true,
  })
  success: boolean;

  @ApiProperty({
    example: 'Operation completed successfully',
  })
  message: string;

  data: T;

  @ApiProperty({
    example: '2026-07-24T12:00:00.000Z',
  })
  timestamp: string;
}
