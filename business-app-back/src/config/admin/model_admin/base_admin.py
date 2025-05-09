from typing import List, Any, AsyncGenerator

from sqladmin import ModelView
from sqladmin.helpers import Writer, secure_filename, stream_to_csv
from starlette.responses import StreamingResponse


class BaseAdmin(ModelView):
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True

    def _get_export_labels(self, export_prop_names: List[str]) -> List[str]:
        _export_prop_names = []
        for item in export_prop_names:
            if item in self.column_labels:
                _export_prop_names.append(self.column_labels[item])
            else:
                _export_prop_names.append(item)

        return _export_prop_names

    async def _export_csv(
        self,
        data: List[Any],
    ) -> StreamingResponse:
        async def generate(writer: Writer) -> AsyncGenerator[Any, None]:
            yield writer.writerow(
                self._get_export_labels(self._export_prop_names),
            )

            for row in data:
                vals = [str(await self.get_prop_value(row, name)) for name in self._export_prop_names]
                yield writer.writerow(vals)

        filename = secure_filename(self.get_export_name(export_type="csv"))

        return StreamingResponse(
            content=stream_to_csv(generate),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment;filename={filename}"},
        )
