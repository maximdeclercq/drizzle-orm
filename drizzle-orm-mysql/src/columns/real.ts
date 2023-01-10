import { ColumnConfig } from 'drizzle-orm';
import { ColumnBuilderConfig } from 'drizzle-orm/column-builder';
import { AnyMySqlTable } from '~/table';
import {
	MySqlColumn,
	MySqlColumnBuilder,
	MySqlColumnBuilderWithAutoIncrement,
	MySqlColumnWithAutoIncrement,
} from './common';

export class MySqlRealBuilder extends MySqlColumnBuilderWithAutoIncrement<
	ColumnBuilderConfig<{
		data: number;
		driverParam: number | string;
	}>
> {
	/** @internal */ precision: number | undefined;
	/** @internal */ scale: number | undefined;

	constructor(name: string, precision?: number, scale?: number) {
		super(name);
		this.precision = precision;
		this.scale = scale;
	}

	/** @internal */
	override build<TTableName extends string>(
		table: AnyMySqlTable<{ name: TTableName }>,
	): MySqlReal<TTableName> {
		return new MySqlReal(table, this);
	}
}

export class MySqlReal<
	TTableName extends string,
> extends MySqlColumnWithAutoIncrement<
	ColumnConfig<{
		tableName: TTableName;
		data: number;
		driverParam: number | string;
	}>
> {
	protected override $mySqlColumnBrand!: 'MySqlReal';

	precision: number | undefined;
	scale: number | undefined;

	constructor(table: AnyMySqlTable<{ name: TTableName }>, builder: MySqlRealBuilder) {
		super(table, builder);
		this.precision = builder.precision;
		this.scale = builder.scale;
	}

	getSQLType(): string {
		if (typeof this.precision !== 'undefined' && typeof this.scale !== 'undefined') {
			return `real(${this.precision}, ${this.scale})`;
		} else if (typeof this.precision === 'undefined') {
			return 'real';
		} else {
			return `real(${this.precision})`;
		}
	}
}

export interface MySqlRealConfig {
	precision?: number;
	scale?: number;
}

export function real(name: string, config: MySqlRealConfig = {}): MySqlRealBuilder {
	return new MySqlRealBuilder(name, config.precision, config.scale);
}
