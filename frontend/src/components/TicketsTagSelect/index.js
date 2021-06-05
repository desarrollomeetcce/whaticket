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
					multiple
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
						userTags.map(tag => (
							<MenuItem dense key={tag.id} value={tag.id}>
								<Checkbox
									style={{
										color: tag.color,
									}}
									size="small"
									color="primary"
									checked={selectedQueueIds.indexOf(tag.id) > -1}
								/>
								<ListItemText primary={tag.name} />
							</MenuItem>
						))}
				</Select>
			</FormControl>
		</div>
	);
};

export default TicketsTagSelect;
