import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RateConversionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(["ETB", "USD", "EUR"], { message: "Currency must be one of the ff: ETB, USD, EUR" })
  @IsString()
  fromCurrency: string;

  @IsEnum(["ETB", "USD", "EUR"], { message: "Currency must be one of the ff: ETB, USD, EUR" })
  @IsString()
  toCurrency: string;
}
