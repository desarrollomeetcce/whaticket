import React from "react";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText } from "@material-ui/core";
import { i18n } from "../../translate/i18n";

const TicketsTagSelect = ({
	userTags,
	selectedQueueIds = [],
	onChange,
}) => {
	const handleChange = e => {
		onChange(e.target.value);
	};

	return (
		<div style={{ width: 120, marginTop: -4 }}>
			<FormControl fullWidth margin="dense">
				<Select
					
					displayEmpty
					variant="outlined"
					value={selectedQueueIds}
					onChange={handleChange}
					MenuProps={{
						anchorOrigin: {
							vertical: "bottom",
							horizontal: "left",
						},
						transformOrigin: {
							vertical: "top",
							horizontal: "left",
						},
						getContentAnchorEl: null,
					}}
					renderValue={() => i18n.t("ticketsTagsSelect.placeholder")}
				>
					{userTags?.length > 0 &&
						userTags.map(option => (
							<MenuItem
							label="Cargando etiquetas"
							value={option.name}
						   key={option.id} name={option.name}>{option.name}</MenuItem>

						
						  ))}
				</Select>
			</FormControl>
		</div>
	);
};

export default TicketsTagSelect;
