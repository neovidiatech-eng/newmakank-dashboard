import CustomForm from "@/components/common/Form/CustomForm";
import type { UsersType } from "./users.schema";
import useUsersLogic from "./useUsersForm.logic";

export default function UsersFormPage({ data }: { data?: UsersType }) {
	const { inputs, t, control, formSubmit } = useUsersLogic({ data });

	return (
		<CustomForm
			handleSubmit={formSubmit}

			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Users Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}

